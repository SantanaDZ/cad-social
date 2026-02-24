-- Trigger to auto-update updated_at column
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_updated_at ON public.inscricoes;

CREATE TRIGGER set_updated_at 
  BEFORE UPDATE ON public.inscricoes
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_updated_at();
