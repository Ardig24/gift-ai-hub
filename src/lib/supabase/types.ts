export type Platform = {
  id: string;
  name: string;
  company?: string;
  category: string;
  description: string;
  features: string[];
  color: string;
  created_at: string;
  updated_at: string;
  subscriptions?: Subscription[];
};

export type Subscription = {
  id: string;
  platform_id: string;
  period: string;
  price: number;
  tier?: string;
  credits?: string;
  popular: boolean;
  created_at: string;
  updated_at: string;
};

export type UserRole = {
  id: string;
  user_id: string;
  role: 'admin' | 'editor';
  created_at: string;
};

export type Order = {
  id: string;
  user_id?: string;
  platform_id: string;
  subscription_id: string;
  recipient_email: string;
  recipient_name: string;
  sender_email: string;
  sender_name: string;
  message?: string;
  delivery_date: string;
  redemption_code: string;
  redeemed: boolean;
  redeemed_at?: string;
  total_amount: number;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      platforms: {
        Row: Platform;
        Insert: Omit<Platform, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Platform, 'id' | 'created_at' | 'updated_at'>>;
      };
      subscriptions: {
        Row: Subscription;
        Insert: Omit<Subscription, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Subscription, 'id' | 'created_at' | 'updated_at'>>;
      };
      user_roles: {
        Row: UserRole;
        Insert: Omit<UserRole, 'id' | 'created_at'>;
        Update: Partial<Omit<UserRole, 'id' | 'created_at'>>;
      };
      orders: {
        Row: Order;
        Insert: Omit<Order, 'id' | 'created_at'>;
        Update: Partial<Omit<Order, 'id' | 'created_at'>>;
      };
    };
  };
};
