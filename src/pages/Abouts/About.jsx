import { useTranslation } from "react-i18next";
import './About.css'


function About() {
  const { t } = useTranslation();

  return (
    <div className='page-container'>
      <div className="about-container">
        <div className="avatar">
          <span className="wave">👋</span>
        </div>
        <h1 className="title">{t("aboutpage.hello")}<br />{t("aboutpage.name")}</h1>
        <div className="info">
          <p><strong>{t("aboutpage.infoLabel")}:</strong> {t("aboutpage.info")}</p>
          <p><strong>{t("aboutpage.emailLabel")}:</strong> ducminh.k23.dut.udn@gmail.com</p>
          <p><strong>{t("aboutpage.githubLabel")}:</strong> <a href="https://github.com/minhdz-2005" target="_blank" rel="noreferrer">minhdz-2005</a></p>
          <p><strong>{t("aboutpage.slackLabel")}:</strong> <a href="https://sun-xseeds.slack.com/team/U05S72X53FZ" target="_blank" rel="noreferrer">Nguyễn Đức Minh</a></p>
          <p><strong>{t("aboutpage.chatworkLabel")}:</strong> <a href="https://www.chatwork.com/21022005" target="_blank" rel="noreferrer">21022005</a></p>
          <p><strong>{t("aboutpage.facebookLabel")}:</strong> <a href="https://www.facebook.com/minh.phung.20649/" target="_blank" rel="noreferrer">Minh Phùng</a></p>
        </div>
      </div>
    </div>
  );
}

export default About;