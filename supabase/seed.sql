INSERT INTO folder (id) values('00000000-0000-0000-0000-000000000000');

CREATE OR REPLACE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE PROCEDURE public.handle_new_user();