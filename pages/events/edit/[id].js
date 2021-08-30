import Layout from "@/components/Layout";
import { FaImage } from "react-icons/fa";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { API_URL } from "@/config/index";
import styles from "@/styles/Form.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import Modal from "@/components/Modal";
import ImageUpload from "@/components/ImageUpload";
import { parseCookies } from "@/helpers/index";

// this is a functional component
export default function EditEventPage({ evt, token }) {
  // for the form, an object named values is set in state, containing
  // the fields present in our api

  const [values, setValues] = useState({
    name: evt.name,
    location: evt.location,
    address: evt.address,
    date: evt.date,
    time: evt.time,
    description: evt.description,
  });

  const [imagePreview, setImagePreview] = useState(
    evt.image ? evt.image.formats.thumbnail.url : null
  );

  const [showModal, setShowModal] = useState(false);

  // declaration to use router
  const router = useRouter();

  // function to handle submission of the form, taking in the event
  const handleSubmit = async (e) => {
    e.preventDefault();

    // input validation
    const hasEmptyFields = Object.values(values).some(
      (element) => element === ""
    );

    if (hasEmptyFields) {
      toast.dark("Please fill in all the fields");
    }

    // res is set to what we are sending the API
    const res = await fetch(`${API_URL}/events/${evt.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      // This is REALLY important
      body: JSON.stringify(values),
    });

    // Error handling
    if (!res.ok) {
      if (res.status === 403 || res.status === 401) {
        toast.error("Unauthorized");
        return;
      }
    } else {
      // the event is set to the response and we push our values to the slug of the event
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

  const imageUploaded = async (e) => {
    const res = await fetch(`${API_URL}/events/${evt.id}`);
    const data = await res.json();
    setImagePreview(data.image.formats.thumbnail.url);
    setShowModal(false);
  };

  return (
    <Layout title="Add new events">
      <Link href="/events">Go Back</Link>
      <h1>Edit Event</h1>
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
              value={moment(values.date).format("yyyy-MM-DD")}
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
        <input type="submit" value="Update Event" className="btn" />
      </form>

      <h2>Event Image</h2>
      {imagePreview ? (
        <Image
          src={imagePreview}
          height={100}
          width={170}
          alt="event preview image"
        />
      ) : (
        <div>
          <p>No image uploaded</p>
        </div>
      )}

      <div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-secondary btn-icon"
        >
          <FaImage /> Set Image
        </button>
      </div>
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <ImageUpload
          evtId={evt.id}
          imageUploaded={imageUploaded}
          token={token}
        ></ImageUpload>
      </Modal>
    </Layout>
  );
}

export async function getServerSideProps({ params: { id }, req }) {
  const { token } = parseCookies(req);
  const res = await fetch(`${API_URL}/events/${id}`);
  const evt = await res.json();

  return {
    props: {
      evt,
      token,
    },
  };
}
