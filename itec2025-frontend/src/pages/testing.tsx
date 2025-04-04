export default function Test() {
  //   async function addUser() {
  //   }
  return (
    <div>
      <h1>Test add user</h1>
      <form>
        <input
          type="text"
          name="username"
          placeholder="username"
          required
        ></input>
        <br />
        <label>What grade are you in?</label>
        <select name="grade" id="grade" required>
          <option value="9">9th</option>
          <option value="10">10th</option>
          <option value="11">11th</option>
          <option value="12">12th</option>
        </select>
        <button
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            fetch("https://itec2025.onrender.com/addUser", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({...data}),
            }).then((response) => {
              if (response.ok) {
                console.log("User added successfully");
              } else {
                console.error("Error adding user");
              }
            });
          }}
        >
          Add user
        </button>
      </form>
      <h1>Test add event</h1>
      <button>Add event</button>
    </div>
  );
}
