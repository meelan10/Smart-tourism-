export { LoginPage as default } from "./AllPages";
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    const res = await api.login(form);

    if (res.access && res.refresh) {
      saveToken(res.access, res.refresh);

      const profile = await api.profile();

      setUser({
        id: profile.id,
        username: profile.username,
        firstName: profile.first_name || profile.username,
        lastName: profile.last_name || "",
        email: profile.email || "",
        is_staff: profile.is_staff,
        is_superuser: profile.is_superuser,
        isAdmin: profile.is_staff || profile.is_superuser,
      });

      navigate("home");
    } else {
      setError("Invalid username or password");
    }
  } catch (err) {
    setError(err?.detail || "Invalid username or password");
  } finally {
    setLoading(false);
  }
};