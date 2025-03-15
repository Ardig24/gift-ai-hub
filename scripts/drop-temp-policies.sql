-- Drop temporary policies after data loading is complete
DROP POLICY IF EXISTS "Temporary allow all operations on platforms" ON public.platforms;
DROP POLICY IF EXISTS "Temporary allow all operations on subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Temporary allow all operations on user_roles" ON public.user_roles;
DROP POLICY IF EXISTS "Temporary allow all operations on orders" ON public.orders;
