-- Add temporary policies for initial data loading
CREATE POLICY "Temporary allow all operations on platforms" 
  ON public.platforms FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Temporary allow all operations on subscriptions" 
  ON public.subscriptions FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Temporary allow all operations on user_roles" 
  ON public.user_roles FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Temporary allow all operations on orders" 
  ON public.orders FOR ALL
  USING (true)
  WITH CHECK (true);
