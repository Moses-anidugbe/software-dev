import { useEffect } from "react";

function Account() {
  // const navigate = useNavigate();
  const token = localStorage.getItem("token");
  useEffect(() => {
    async function getAccount() {
      const response = await fetch("http://localhost:3000/account", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      console.log(data);
    }

    getAccount();
  }, []);
  return (
    <div>
      <h1>Account</h1>
      <p>Account page works.</p>
    </div>
  );
}

export default Account;
