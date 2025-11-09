-- Create table for app settings
CREATE TABLE public.app_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contract_address TEXT,
  pumpfun_link TEXT,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Create policy to allow everyone to read settings
CREATE POLICY "Anyone can view app settings" 
ON public.app_settings 
FOR SELECT 
USING (true);

-- Create policy to allow everyone to update settings
CREATE POLICY "Anyone can update app settings" 
ON public.app_settings 
FOR UPDATE 
USING (true);

-- Create policy to allow anyone to insert settings
CREATE POLICY "Anyone can insert app settings" 
ON public.app_settings 
FOR INSERT 
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_app_settings_updated_at
BEFORE UPDATE ON public.app_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial row
INSERT INTO public.app_settings (contract_address, pumpfun_link)
VALUES ('', '');