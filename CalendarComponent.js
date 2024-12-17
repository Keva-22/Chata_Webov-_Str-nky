// CalendarComponent.js

import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const CalendarComponent = () => {
    const [bookedDays, setBookedDays] = useState([]);
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(String(new Date().getMonth() + 1).padStart(2, '0'));

    useEffect(() => {
        fetch(`http://localhost:3000/api/reservations/${year}/${month}`)
            .then(response => response.json())
            .then(data => setBookedDays(data))
            .catch(error => console.error('Error fetching booked days:', error));
    }, [year, month]);

    const tileClassName = ({ date, view }) => {
        if (view === 'month') {
            const day = date.getDate();
            if (bookedDays.includes(day)) {
                return 'booked';
            }
        }
    };

    return (
        <div>
            <Calendar
                onActiveStartDateChange={({ activeStartDate }) => {
                    setYear(activeStartDate.getFullYear());
                    setMonth(String(activeStartDate.getMonth() + 1).padStart(2, '0'));
                }}
                tileClassName={tileClassName}
            />
            <style jsx>{`
                .booked {
                    background-color: red !important;
                    color: white !important;
                }
            `}</style>
        </div>
    );
};

export default CalendarComponent;