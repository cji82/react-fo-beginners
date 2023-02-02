import PropTyps from "prop-types";
import styles from "./Button.module.css";

function Button({text}){
    return <button className={styles.btn}>{text}</button>;
}

Button.PropTyps = {
    text:PropTyps.string.isRequired,
}

export default Button;