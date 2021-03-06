import Layout from "@/components/Layout";
import { useState } from "react";
import { useRouter } from "next/router";
import { parseCookies } from "@/helpers/index";
import Link from "next/link";
import { API_URL } from "@/config/index";
import styles from "@/styles/Form.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// this is a functional component
export default function AddEventPage({ token }) {
  // for the form, an object named values is set in state, containing
  // the fields present in our api

  const [values, setValues] = useState({
    name: "",
    location: "",
    address: "",
    date: "",
    time: "",
    description: "",
  });

  // declaration to use router
  const router = useRouter();

  // function to handle submission of the form, taking in the event
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(token);

    // input validation
    const hasEmptyFields = Object.values(values).some(
      (element) => element === ""
    );

    if (hasEmptyFields) {
      toast.dark("Please fill in all the fields");
    }

    // res is set to what we are sending the API
    const res = await fetch(`${API_URL}/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      if (res.status === 403 || res.status === 401) {
        toast.error("Unauthorized");
        return;
      }
      toast.error("Something Went Wrong");
    } else {
      const evt = await res.json();
      router.push(`/events/${evt.slug}`);
    }
  };

  // function to handle a change in input within a form field
  const handleInputChange = (e) => {
    // deconstructs the name and value from the form field
    // so for example, on the 'location' field with a value of 'stirling'
    // the {name, value} will be {location, stirling}
    const { name, value } = e.target;

    // Spreads the current values and sets the inputted values 'name' and 'value' within the // values state
    setValues({ ...values, [name]: value });
  };

  return (
    <Layout title="Add new events">
      <Link href="/events">Go Back</Link>
      <h1>Add Event</h1>
      <ToastContainer position="top-center"></ToastContainer>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.grid}>
          <div>
            <label htmlFor="name">Event Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={values.name}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="location">location</label>
            <input
              type="text"
              name="location"
              id="location"
              value={values.location}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="address">Address</label>
            <input
              type="text"
              name="address"
              id="address"
              value={values.address}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="date">Date</label>
            <input
              type="date"
              name="date"
              id="date"
              value={values.date}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="time">Time</label>
            <input
              type="text"
              name="time"
              id="time"
              value={values.time}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div>
          <label htmlFor="description">Event Description</label>
          <textarea
            type="text"
            name="description"
            id="description"
            value={values.description}
            onChange={handleInputChange}
          ></textarea>
        </div>
        <input type="submit" value="Add Event" className="btn" />
      </form>
    </Layout>
  );
}

export async function getServerSideProps({ req }) {
  const { token } = parseCookies(req);

  return {
    props: {
      token,
    },
  };
}
