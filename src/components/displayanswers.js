import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './displayanswers.css';

const DisplayAnswers = () => {
  const { studentNumber } = useParams();
  const [answers, setAnswers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/tableinfo/answers/${studentNumber}/`)
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
        } else {
          setAnswers(data);
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError('Error fetching data');
      });
  }, [studentNumber]);

  if (error) {
    return <div className="form-container"><p>{error}</p></div>;
  }

  if (answers.length === 0) {
    return <div className="form-container"><p>Loading...</p></div>;
  }

  // Group answers by table name and calculate "Yes" and "No" counts
  const groupedAnswers = answers.reduce((acc, answer) => {
    if (!acc[answer.table_name]) {
      acc[answer.table_name] = {
        yesCount: 0,
        noCount: 0
      };
    }
    if (answer.is_true) {
      acc[answer.table_name].yesCount += 1;
    } else {
      acc[answer.table_name].noCount += 1;
    }
    return acc;
  }, {});

  // Determine which table(s) have the most "Yes" answers
  const mostYesTables = [];
  let maxYesCount = 0;

  Object.keys(groupedAnswers).forEach(tableName => {
    const { yesCount } = groupedAnswers[tableName];
    if (yesCount > maxYesCount) {
      maxYesCount = yesCount;
      mostYesTables.length = 0;
      mostYesTables.push(tableName);
    } else if (yesCount === maxYesCount) {
      mostYesTables.push(tableName);
    }
  });

  const table1Paragraph = "تشمل الأشخاص الذين يمتلكون قدرة عالية من ضبط النفس ويحبذون التعامل مع الأعداد والأرقام، ويتميزون بالدقة في العمل والالتزام بالقواعد والقوانين والأنظمة المحددة في سياق العمل. المهن الملائمة لهم: أمين مكتبة للفهرسة - منسق  طبي - صــــــــــراف - طبــــــــــاع - فني سجلات طبية - كاتب حسابات - محاســـــــب - محلل مالي - مدقق مالي - مساعد إداري - مفتش جمارك - موظف معالج بيانات – موظف احصاءات- مفتش مباني - مهندس مدني(معماري)- مهندس كيماوي- مهندس انتاج- مهندس صناعي- مهندس اتصالات- مهندس زراعي- مهندس طيران – اثار. التخصصات الملائمة: إدخال البيانات – محاسبة-  أعمال السكرتارية - برمجة حاسب آلي - سجلات طبية - علم المكتبات - قانـــــــــون - احصاء – رياضيات - هندسة اتصالات - هندسة الأمن والسلامة - كافة التخصصات الهندسية.";
  
  const table2Paragraph = "يندرج تحت هذه البيئة الأفراد الذين يتميزون بالقدرات الرياضية، والميكانيكية ويفضلون العمل مع الآلات والمعدات والنباتات والحيوانات أو العمل خارج نطاق المكاتب. المهن الملائمة لهم: أخصائي إسعافات الطوارئ - الإعلان والتسويق ومديرو العلاقات – صحفي - كاتب مقايضة – مترجم - مضيف جوي - مدير مشروع تجاري – مدير في اي مؤسسة او شركة- مدير فندق - ممثل علاقات عامة - رجل السياسة – المحاماة - مندوب مبيعات - مندوب مصانع - موظف سفريات. التخصصات الملائمة: إحصاء - إدارة أعمال - تجارة واقتصاد – تسويق – رياضيات - سياحة / ضيافة - صحافة وإعلام – قانون - علاقات عامة – لغات - محاسبة ومالية - هندسة التحكم.";

  const displayParagraph = mostYesTables.includes('Table 1') ? table1Paragraph : table2Paragraph;

  return (
    <div className="form-container">
      <table className="table-container">
        <thead>
          <tr>
            <th>Table Name</th>
            <th>Most Yes</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{mostYesTables.join(', ')}</td>
            <td>{maxYesCount}</td>
          </tr>
          <tr>
      <p>{displayParagraph}</p>

          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default DisplayAnswers;
