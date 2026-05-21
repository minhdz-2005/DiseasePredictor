import './History.css';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const History = () => {
  const { t } = useTranslation();
  const [isLogedIn, setIsLogedIn] = useState(false);
  const [historyList, setHistoryList] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem("userDP");
    if (!userStr) {
      setIsLogedIn(false);
      setLoading(false);
      return;
    }

    const user = JSON.parse(userStr);
    setIsLogedIn(true);

    const fetchHistory = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/history/?user=${user.user.id}`);
        if (!res.ok) throw new Error("Failed to fetch history");

        const data = await res.json();
        const sorted = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setHistoryList(sorted);
      } catch (err) {
        console.error("Error fetching history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  if (isLoading) {
    return <div className="his-page text-center mt-5">Loading...</div>;
  }

  if (!isLogedIn) {
    return <h2 className="page-title">{t('history-page.title-logout')}</h2>;
  }

  return (
    <div className="his-page">
      <h2 className="page-title mb-3">{t('history-page.title-login')}</h2>

      <div className="history-list">
        {historyList.length === 0 ? (
          <p className="no-history">{t('history-page.no-history')}</p>
        ) : (
          historyList.map((item) => (
            <div key={item.id} className="history-item">
              <div className="history-date">{formatDate(item.created_at)}</div>

              {/* TRIỆU CHỨNG */}
              <div className="history-symptoms">
                <strong>{t("predictpage.symptoms")}:</strong>{" "}
                {item.symptoms
                  .map(sym => t(`symptom.${sym}`))
                  .join(", ")}
              </div>

              {/* KẾT QUẢ */}
              <div className="history-results">
                <div className="disease">
                  <span className="disease-name">{t(`disease.${item.disease_1}`)}</span>
                  <span className="disease-prob">{item.prob_1}%</span>
                </div>

                <div className="disease">
                  <span className="disease-name">{t(`disease.${item.disease_2}`)}</span>
                  <span className="disease-prob">{item.prob_2}%</span>
                </div>

                <div className="disease">
                  <span className="disease-name">{t(`disease.${item.disease_3}`)}</span>
                  <span className="disease-prob">{item.prob_3}%</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default History;
