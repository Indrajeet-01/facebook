import { useState } from "react";
import { Link } from "react-router-dom";
import SettingsPrivacy from "./SettingsPrivacy";
import DisplayAccessibility from "./DisplayAccessibility";
import HelpSupport from "./HelpSupport";


export default function UserMenu({user}) {
    const [visible, setVisible] = useState(0)
  return (
    <div className="mmenu">
        {visible === 0 && (
            <div>
        <Link to="/profile" className="mmenu_header hover3">
            <img src={user?.picture} alt="" />
            <div className="mmenu_col">
                <span>
                    {user?.first_name}
                    {user?.last_name}
                </span>
                <span>See ypur profile</span>
            </div>
        </Link>
        <div className="mmenu_splitter"></div>
        <div className="mmenu_main hover3">
            <div className="small_circle">
                <i className="report_filled_icon"></i>
            </div>
            <div className="mmenu_col">
                <div className="mmenu_span1">Give feedback</div>
                <div className="mmenu_span2">Help us improve facebook</div>
            </div>
        </div>
        <div className="mmenu_splitter"></div>
        <div className="mmenu_item hover3">
            <div className="small_circle">
                <div className="settings_filled_icon"></div>
            </div>
            <span>Settings & privacy</span>
            <div className="rArrow">
                <i className="right_icon"></i>
            </div>
        </div>
        <div className="mmenu_item hover3">
            <div className="small_circle">
                <div className="help_filled_icon"></div>
            </div>
            <span>Help & support</span>
            <div className="rArrow">
                <i className="right_icon"></i>
            </div>
        </div>
        <div className="mmenu_item hover3">
            <div className="small_circle">
                <div className="dark_filled_icon"></div>
            </div>
            <span>Display & Accessibilty</span>
            <div className="rArrow">
                <i className="right_icon"></i>
            </div>
        </div>
        <div className="mmenu_item hover3">
            <div className="small_circle">
                <div className="logout_filled_icon"></div>
            </div>
            <span>Logout</span>
        </div>
        </div>
        )}
        {visible === 1 && <SettingsPrivacy setVisible={setVisible} />}
        {visible === 2 && <HelpSupport setVisible={setVisible} />}
        {visible === 3 && <DisplayAccessibility setVisible={setVisible} />}
    </div>
    )
}
