
-- Create app role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'member');

-- 1. Profiles table (linked to auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  first_name TEXT NOT NULL,
  surname TEXT NOT NULL,
  email TEXT NOT NULL,
  risk_level TEXT CHECK (risk_level IN ('Low','Medium','High')) DEFAULT 'Low',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. User roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'member',
  UNIQUE (user_id, role)
);

-- 3. Contributions table
CREATE TABLE public.contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  month TEXT NOT NULL,
  year INTEGER NOT NULL,
  paid BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Loans table
CREATE TABLE public.loans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  interest_rate NUMERIC(5,2) NOT NULL DEFAULT 0,
  interest_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  total_repayment NUMERIC(10,2) NOT NULL DEFAULT 0,
  repayment_months INTEGER NOT NULL,
  status TEXT CHECK (status IN ('Pending','Approved','Active','Repaid','Overdue')) DEFAULT 'Pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Repayments table
CREATE TABLE public.repayments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loan_id UUID REFERENCES public.loans(id) ON DELETE CASCADE NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  paid_on TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.repayments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (avoids infinite recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS Policies for user_roles
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Only admins can manage roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

-- RLS Policies for contributions
CREATE POLICY "Users can view own contributions"
  ON public.contributions FOR SELECT
  TO authenticated
  USING (member_id = auth.uid());

CREATE POLICY "Admins can view all contributions"
  ON public.contributions FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert contributions"
  ON public.contributions FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for loans
CREATE POLICY "Users can view own loans"
  ON public.loans FOR SELECT
  TO authenticated
  USING (member_id = auth.uid());

CREATE POLICY "Admins can view all loans"
  ON public.loans FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert loans"
  ON public.loans FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update loans"
  ON public.loans FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for repayments
CREATE POLICY "Users can view own repayments"
  ON public.repayments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.loans
      WHERE loans.id = repayments.loan_id
      AND loans.member_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all repayments"
  ON public.repayments FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert repayments"
  ON public.repayments FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for notifications
CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  TO authenticated
  USING (member_id = auth.uid());

CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  TO authenticated
  USING (member_id = auth.uid());

CREATE POLICY "Admins can insert notifications"
  ON public.notifications FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Trigger: Auto-calculate loan interest on insert
CREATE OR REPLACE FUNCTION public.calculate_loan_interest()
RETURNS TRIGGER AS $$
DECLARE
  rate NUMERIC;
BEGIN
  -- Staggered interest logic matching the app's existing rates
  IF NEW.amount <= 1000 THEN rate := 5;
  ELSIF NEW.amount <= 5000 THEN rate := 8;
  ELSIF NEW.amount <= 10000 THEN rate := 12;
  ELSIF NEW.amount <= 25000 THEN rate := 15;
  ELSE rate := 18;
  END IF;

  NEW.interest_rate := rate;
  NEW.interest_amount := (NEW.amount * rate) / 100;
  NEW.total_repayment := NEW.amount + NEW.interest_amount;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER loan_interest_trigger
  BEFORE INSERT ON public.loans
  FOR EACH ROW
  EXECUTE FUNCTION public.calculate_loan_interest();

-- Trigger: Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, surname, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'surname', ''),
    NEW.email
  );
  
  -- Auto-assign member role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, COALESCE((NEW.raw_user_meta_data->>'role')::app_role, 'member'));
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Trigger: Update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Risk calculation function
CREATE OR REPLACE FUNCTION public.update_member_risk(member_uuid UUID)
RETURNS VOID AS $$
DECLARE
  missed_contributions INT;
  active_loans INT;
  risk TEXT;
BEGIN
  SELECT COUNT(*) INTO missed_contributions
  FROM public.contributions
  WHERE member_id = member_uuid AND paid = false;

  SELECT COUNT(*) INTO active_loans
  FROM public.loans
  WHERE member_id = member_uuid AND status = 'Active';

  IF missed_contributions + active_loans >= 3 THEN
    risk := 'High';
  ELSIF missed_contributions + active_loans >= 1 THEN
    risk := 'Medium';
  ELSE
    risk := 'Low';
  END IF;

  UPDATE public.profiles
  SET risk_level = risk
  WHERE id = member_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Auto-update risk after loan changes
CREATE OR REPLACE FUNCTION public.auto_update_risk()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM public.update_member_risk(NEW.member_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER risk_trigger_loans
  AFTER INSERT OR UPDATE ON public.loans
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_update_risk();

CREATE TRIGGER risk_trigger_contributions
  AFTER INSERT OR UPDATE ON public.contributions
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_update_risk();
