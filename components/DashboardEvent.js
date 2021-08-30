import Link from "next/link";
import { HiOutlineX, HiOutlinePencil } from "react-icons/hi";
import styles from "@/styles/DashboardEvent.module.css";

export default function DashboardEvent({ evt, handleDelete }) {
  return (
    <div className={styles.event}>
      <h4>
        <Link href={`/events/${evt.slug}`}>
          <a>{evt.name}</a>
        </Link>
      </h4>
      <Link href={`/events/edit/${evt.id}`}>
        <a>
          <HiOutlinePencil>
            <span>Edit Event</span>
          </HiOutlinePencil>
        </a>
      </Link>
      <a
        href="#"
        className={styles.delete}
        onClick={() => handleDelete(evt.id)}
      >
        <HiOutlineX></HiOutlineX> <span>Delete</span>
      </a>
    </div>
  );
}
