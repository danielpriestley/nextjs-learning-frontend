import Head from "next/head";
import styles from "../styles/Layout.module.css";
import { useRouter } from "next/router";
import Header from "./Header";
import Footer from "./Footer";
import Showcase from "./Showcase";
export default function Layout({ title, keywords, description, children }) {
  const router = useRouter();
  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
      </Head>
      <Header></Header>
      {router.pathname === "/" && <Showcase></Showcase>}
      <div className={styles.container}>{children}</div>
      <Footer></Footer>
    </div>
  );
}

Layout.defaultProps = {
  title: "DODO Events | Nature Meetups",
  description: "Find the nature tours and meetups",
  keywords: "nature, ecology, zoology, tours, meetups",
};
