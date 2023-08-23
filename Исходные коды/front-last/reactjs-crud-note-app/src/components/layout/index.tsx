import styles from "./index.module.css";
import { Header } from "./header";
import React from "react";

type Props = {
    children: React.ReactNode;
}

export const Layout = ({ children }: Props) => {
    return (
        <div className={styles.main}>
            {/*<Header />*/}
            <div>
                {children}
            </div>
        </div>
    );
};