import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './tabletype.css'; // Ensure the path is correct

const TableTypes = () => {
  const [tableTypes, setTableTypes] = useState([]);
  const [currentTableIndex, setCurrentTableIndex] = useState(0);
  const [currentTableData, setCurrentTableData] = useState({});
  const [allTableData, setAllTableData] = useState({});
  const [studentData, setStudentData] = useState({
    studentNumber: '',
    name: '',
    specialization: '',
    college: '',
    phoneNumber: '',
    email: '',
    gender: 'M',
    whichYear: 1,
    dateOfBirth: '',
    address: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/tabletypes/')
      .then((response) => response.json())
      .then((data) => {
        setTableTypes(data);
      })
      .catch((error) => {
        console.error('There was an error fetching the table types!', error);
      });
  }, []);

  const handleAnswerChange = (questionId, answer) => {
    setCurrentTableData((prevData) => ({
      ...prevData,
      [questionId]: answer,
    }));
  };

  const handleSubmit = () => {
    const currentTableType = tableTypes[currentTableIndex];

    const unansweredQuestions = currentTableType.tables.some(
      (table) => !currentTableData[table.id]
    );
    if (unansweredQuestions) {
      setErrorMessage('Please answer all questions before proceeding.');
      return;
    }

    setErrorMessage('');

    const updatedAllTableData = {
      ...allTableData,
      ...currentTableData,
    };
    setAllTableData(updatedAllTableData);

    if (currentTableIndex < tableTypes.length - 1) {
      setCurrentTableIndex(currentTableIndex + 1);
      setCurrentTableData({});
    } else {
      sendAllData(updatedAllTableData);
    }
  };

  const sendAllData = (finalAllTableData) => {
    const allAnswers = tableTypes.flatMap((tableType) =>
      tableType.tables.map((table) => ({
        question_id: table.id,
        answer: finalAllTableData[table.id],
      }))
    );

    const payload = {
      ...studentData,
      answers: allAnswers,
    };

    fetch('http://127.0.0.1:8000/api/tableinfo/answer/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
        navigate(`/answers/${studentData.studentNumber}`);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleStartForm = () => {
    if (studentData.studentNumber) {
      setShowForm(true);
    } else {
      setErrorMessage('Please enter a student number.');
    }
  };

  if (tableTypes.length === 0) return <div>Loading...</div>;

  const currentTableType = tableTypes[currentTableIndex];

  return (
    <div className="form-container">
      {!showForm && (
        <div>
          <label>
            Student Number:
            <input
              type="text"
              value={studentData.studentNumber}
              onChange={(e) =>
                setStudentData({ ...studentData, studentNumber: e.target.value })
              }
            />
          </label>
          <label>
            Name:
            <input
              type="text"
              value={studentData.name}
              onChange={(e) =>
                setStudentData({ ...studentData, name: e.target.value })
              }
            />
          </label>
          <label>
            Specialization:
            <input
              type="text"
              value={studentData.specialization}
              onChange={(e) =>
                setStudentData({ ...studentData, specialization: e.target.value })
              }
            />
          </label>
          <label>
            College:
            <input
              type="text"
              value={studentData.college}
              onChange={(e) =>
                setStudentData({ ...studentData, college: e.target.value })
              }
            />
          </label>
          <label>
            Phone Number:
            <input
              type="text"
              value={studentData.phoneNumber}
              onChange={(e) =>
                setStudentData({ ...studentData, phoneNumber: e.target.value })
              }
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              value={studentData.email}
              onChange={(e) =>
                setStudentData({ ...studentData, email: e.target.value })
              }
            />
          </label>
          <label>
            Gender:
            <select
              value={studentData.gender}
              onChange={(e) =>
                setStudentData({ ...studentData, gender: e.target.value })
              }
            >
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
          </label>
          <label>
            Year:
            <input
              type="number"
              value={studentData.whichYear}
              onChange={(e) =>
                setStudentData({ ...studentData, whichYear: e.target.value })
              }
            />
          </label>
          <label>
            Date of Birth:
            <input
              type="date"
              value={studentData.dateOfBirth}
              onChange={(e) =>
                setStudentData({ ...studentData, dateOfBirth: e.target.value })
              }
            />
          </label>
          <label>
            Address:
            <input
              type="text"
              value={studentData.address}
              onChange={(e) =>
                setStudentData({ ...studentData, address: e.target.value })
              }
            />
          </label>
          <button onClick={handleStartForm}>Start</button>
        </div>
      )}
      {showForm && (
        <>
          <h1>{currentTableType.name}</h1>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <table className="table-container">
              <thead>
                <tr>
                  <th>Question</th>
                  <th>Yes</th>
                  <th>No</th>
                </tr>
              </thead>
              <tbody>
                {currentTableType.tables.map((tableInfo) => (
                  <tr key={tableInfo.id}>
                    <td>{tableInfo.question}</td>
                    <td>
                      <input
                        type="radio"
                        name={`question-${tableInfo.id}`}
                        value="yes"
                        checked={currentTableData[tableInfo.id] === 'yes'}
                        onChange={() => handleAnswerChange(tableInfo.id, 'yes')}
                      />
                    </td>
                    <td>
                      <input
                        type="radio"
                        name={`question-${tableInfo.id}`}
                        value="no"
                        checked={currentTableData[tableInfo.id] === 'no'}
                        onChange={() => handleAnswerChange(tableInfo.id, 'no')}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button type="submit">
              {currentTableIndex < tableTypes.length - 1 ? 'Next' : 'Submit'}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default TableTypes;
