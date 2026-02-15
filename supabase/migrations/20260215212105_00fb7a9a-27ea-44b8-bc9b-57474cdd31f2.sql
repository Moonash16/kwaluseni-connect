
-- Allow members to insert their own loan requests
CREATE POLICY "Members can insert own loans"
ON public.loans
FOR INSERT
TO authenticated
WITH CHECK (member_id = auth.uid());

-- Allow members to insert their own contributions
CREATE POLICY "Members can insert own contributions"
ON public.contributions
FOR INSERT
TO authenticated
WITH CHECK (member_id = auth.uid());

-- Allow admins to delete profiles
CREATE POLICY "Admins can delete profiles"
ON public.profiles
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to delete contributions
CREATE POLICY "Admins can delete contributions"
ON public.contributions
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to delete loans
CREATE POLICY "Admins can delete loans"
ON public.loans
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to delete repayments
CREATE POLICY "Admins can delete repayments"
ON public.repayments
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to delete notifications
CREATE POLICY "Admins can delete notifications"
ON public.notifications
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to delete user roles
CREATE POLICY "Admins can delete user roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));
