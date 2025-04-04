import { useAuth } from "@clerk/nextjs";

export default function Test() {
  const { getToken } = useAuth();
  return (
    <div>
      <h1>Test add user</h1>
      <form id="userForm">
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
          onClick={async (e) => {
            e.preventDefault();

            const form = document.getElementById("userForm") as HTMLFormElement;
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            const token = await getToken();
            console.log(token);
            console.log(data);
            fetch("https://itec2025.onrender.com/addUser", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(data),
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
      <form id="eventForm">
        <input
          type="text"
          name="title"
          placeholder="event name"
          required
        ></input>
        <input
          type="text"
          name="description"
          placeholder="event description"
          required
        ></input>
        <input type="datetime-local" name="date" required></input>
        <label>What grade?</label>
        <select name="grade" id="grade" required>
          <option value="9">9th</option>
          <option value="10">10th</option>
          <option value="11">11th</option>
          <option value="12">12th</option>
        </select>
        <br />
        <select name="class" id="class" required>
          <option value="math">Math</option>
          <option value="chemistry">Chemistry</option>
          <option value="biology">Biology</option>
          <option value="english">English</option>
          <option value="computerScience">Computer science</option>
        </select>
        <br />
        <input
          type="number"
          name="personLimit"
          placeholder="person limit"
        ></input>
        <br />
        <button
          type="submit"
          onClick={async (e) => {
            e.preventDefault();

            const form = document.getElementById(
              "eventForm"
            ) as HTMLFormElement;
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            const token = await getToken();
            console.log(data);
            //https://itec2025.onrender.com/addEvent
            fetch("http://localhost:3001/addEvent", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(data),
            }).then((response) => {
              if (response.ok) {
                console.log("Event added successfully");
              } else {
                console.error("Error adding event");
              }
            });
          }}
        >
          Add event
        </button>
      </form>
    </div>
  );
}
