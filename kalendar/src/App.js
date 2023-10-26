import './App.css';
import React, { useState, useEffect} from 'react';
import moment from 'moment';
import axios from 'axios';
import { FaRegArrowAltCircleLeft, FaRegArrowAltCircleRight } from 'react-icons/fa';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(moment());
  const [commits, setCommits] = useState([])

  const daysInMonth = currentDate.daysInMonth();
  const firstDayOfMonth = moment(currentDate).date(1);
  const startDay = firstDayOfMonth.day();

  const activities = [
    {
      date: '2023-10-16',
      name: 'Mehaničar',
      startTime: '14:00',
      endTime: null,
      isCompleted: true 
    },

    {
      date: '2023-10-29',
      name: 'Sastanak',
      startTime: '16:00',
      endTime: '17:15',
      isCompleted: false 
    },

    {
      date: '2023-11-06',
      name: 'Zubar',
      startTime: '10:00',
      endTime: '11:00',
      isCompleted: false
    },

    {
      date: '2023-11-10',
      name: 'Supruga rođendan',
      isCompleted: false
    }
  ]
  
  useEffect(() => {
    const fetchCommits = async () => {
      try {
        const response = await axios.get('https://api.github.com/repos/octocat/Hello-World/commits', {
          params: {
            until: currentDate.format('YYYY-MM-DD'),
            per_page: 10
          },
        });

        setCommits(response.data);
      } catch (error) {
        console.error('Greška prilikom dohvaćanja commit-ova:', error);
      }
    };

    fetchCommits();
  }, [currentDate]);

  const renderCalendar = () => {
    const calendar = [];
    let day = 1;
  
    for (let i = 0; i < 6; i++) {
      const week = [];
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < startDay) {
          week.push(<td key={`empty-${j}`}></td>);
        } else if (day <= daysInMonth) {
          const isToday = day === moment().date() && currentDate.isSame(moment(), 'month');
          const isCurrentMonth = currentDate.isSame(moment().date(day), 'month'); // Provjeri je li trenutni dan u istom mjesecu
          const dateKey = currentDate.date(day).format('YYYY-MM-DD');
          const dayActivities = activities.filter(activity => activity.date === dateKey);
  
          week.push(
            <td key={day} className={`${isToday ? 'today' : ''} ${dayActivities.length > 0 ? 'has-activity' : ''}`}>
              <div className="day-number">{day}</div>
              {dayActivities.length > 0 ? (
                dayActivities.map(activity => (
                  <div key={activity.name} className={`activity ${activity.isCompleted ? 'completed-activity' : ''}`}>
                    <div className="activity-name">{activity.name}</div>
                      {activity.startTime || activity.endTime ? (
                        <div className="activity-time">
                          {activity.startTime} - {activity.endTime}
                        </div>
                      ) : null }
                    </div>
                ))
              ) : (
                day === moment().date() && currentDate.isSame(moment(), 'month') ? (
                  <div className="no-activity">Danas nema aktivnosti</div>
                ) : null
              )}
            </td>
          );          
          day++;
        }
      }
      calendar.push(<tr key={`week-${i}`}>{week}</tr>);
    }
  
    return calendar;
  };


  
  const prevMonth = () => {
    setCurrentDate(moment(currentDate).subtract(1, 'month'));
  };

  const nextMonth = () => {
    setCurrentDate(moment(currentDate).add(1, 'month'));
  };

  return (
    <div className='App'>
      <div className='header'>
        <h2>{currentDate.format('MMMM YYYY')}</h2>
        <div className='buttons'>
          <button onClick={prevMonth}><FaRegArrowAltCircleLeft/></button>
          <button onClick={nextMonth}><FaRegArrowAltCircleRight/></button>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>{renderCalendar()}</tbody>
      </table>
    </div>
  );
};

export default Calendar;
