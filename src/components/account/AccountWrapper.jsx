import {Form} from "formik";
import { Link } from 'react-router-dom';

import style from '@/styles/account.module.css';


/**
 * The AccountWrapper component is a functional component that renders a wrapper div with
 * a title, a form, and a redirect link.
 * 
 * @returns a wrapper component for the account page.
 */
const AccountWrapper = (props) => {
  return (
    <div className={style.account_wrapper}>
      <div className={style.account_container}>
        
        <div className={`${style.primary_title} link_text`}>HealPoint</div>
        <Form className={style.form}>{props.children}</Form>

        <div className={style.redirect_link}>
          <span>{props.promptText}</span>
          <Link to={props.url} className="link_text">
            {props.urlText}
          </Link>
        </div>

      </div>
    </div>
  );
};

export default AccountWrapper;
