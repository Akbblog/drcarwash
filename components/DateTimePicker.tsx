"use client";

import { useState, useEffect, ReactNode } from "react";
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    isSameMonth,
    isSameDay,
    addDays,
    parse
} from "date-fns";

type Props = {
    dayName: string;
    timeName: string;
    defaultDay?: string;
    defaultTime?: string;
    label: string;
    onSelectionChange?: (date: Date | null, time: string) => void;
    footer?: ReactNode;
};

export default function DateTimePicker({ dayName, timeName, defaultDay, defaultTime, label, onSelectionChange, footer }: Props) {
    const [currentMonth, setCurrentMonth] = useState(defaultDay ? new Date(defaultDay) : new Date());

    // Derived state from props - Controlled Component Pattern
    const selectedDate = defaultDay ? new Date(defaultDay) : null;
    const selectedTime = defaultTime || "";

    // Sync currentMonth with defaultDay only when defaultDay changes significantly (optional, but good for UX)
    useEffect(() => {
        if (defaultDay) {
            const date = new Date(defaultDay);
            if (!isNaN(date.getTime()) && !isSameMonth(date, currentMonth)) {
                setCurrentMonth(date);
            }
        }
    }, [defaultDay]); // We can keep this one safely as it only updates on month change

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    const onDateClick = (day: Date) => {
        if (onSelectionChange) {
            onSelectionChange(day, selectedTime);
        }
    };

    const handleTimeClick = (time: string) => {
        if (onSelectionChange) {
            onSelectionChange(selectedDate, time);
        }
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-between items-center mb-2 px-1">
                <button
                    type="button"
                    onClick={prevMonth}
                    className="text-white/50 hover:text-white transition-colors p-1"
                >
                    ←
                </button>
                <span className="text-white font-bold uppercase tracking-widest text-xs">
                    {format(currentMonth, "MMMM yyyy")}
                </span>
                <button
                    type="button"
                    onClick={nextMonth}
                    className="text-white/50 hover:text-white transition-colors p-1"
                >
                    →
                </button>
            </div>
        );
    };

    const renderDays = () => {
        const days = [];
        const dateFormat = "EEEEE";
        const startDate = startOfWeek(currentMonth);

        for (let i = 0; i < 7; i++) {
            days.push(
                <div key={i} className="text-center text-[9px] text-[#666] uppercase font-bold py-1">
                    {format(addDays(startDate, i), dateFormat)}
                </div>
            );
        }

        return <div className="grid grid-cols-7 mb-1">{days}</div>;
    };

    const renderCells = () => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);

        const dateFormat = "d";
        const rows = [];
        let days = [];
        let day = startDate;
        let formattedDate = "";

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                formattedDate = format(day, dateFormat);
                const cloneDay = day;

                const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
                const isCurrentMonth = isSameMonth(day, monthStart);

                days.push(
                    <div
                        key={day.toString()}
                        className={`relative p-1.5 text-center text-xs cursor-pointer transition-all duration-200 rounded-md
              ${!isCurrentMonth ? "text-[#333]" : "text-white"}
              ${isSelected ? "bg-[#ff3366] text-white shadow-[0_0_10px_rgba(255,51,102,0.4)]" : "hover:bg-white/5"}
            `}
                        onClick={() => onDateClick(cloneDay)}
                    >
                        <span>{formattedDate}</span>
                    </div>
                );
                day = addDays(day, 1);
            }
            rows.push(
                <div key={day.toString()} className="grid grid-cols-7 gap-0.5">
                    {days}
                </div>
            );
            days = [];
        }
        return <div>{rows}</div>;
    };

    const dayValue = selectedDate ? format(selectedDate, "EEEE, MMMM do, yyyy") : (defaultDay || "");

    return (
        <div className="bg-black/30 border border-white/5 rounded-xl p-3">
            <label className="block text-[10px] text-[#999] uppercase tracking-widest mb-3">
                {label}
            </label>

            <input type="hidden" name={dayName} value={dayValue} />
            <input type="hidden" name={timeName} value={selectedTime} />

            <div className="flex flex-col gap-6">
                {/* Calendar Section */}
                <div>
                    {renderHeader()}
                    {renderDays()}
                    {renderCells()}
                </div>

                {/* Time Selection Section */}
                <div className="pt-2 border-t border-white/5">
                    <p className="text-[9px] text-[#666] uppercase tracking-widest mb-2 text-center">
                        Select Time Slot
                    </p>

                    <div className="grid grid-cols-2 gap-2">
                        <button
                            type="button"
                            onClick={() => handleTimeClick("Morning (8am-12pm)")}
                            className={`w-full p-2 rounded-md border text-xs font-bold uppercase tracking-wider transition-all duration-300 flex flex-col items-center justify-center gap-1 group
                                ${selectedTime === "Morning (8am-12pm)"
                                    ? "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.15)]"
                                    : "bg-transparent border-white/10 text-white hover:border-[#ff3366] hover:text-[#ff3366]"
                                }
                            `}
                        >
                            <span>Morning</span>
                            <span className={`text-[8px] ${selectedTime === "Morning (8am-12pm)" ? "text-black/60" : "text-white/40 group-hover:text-[#ff3366]/60"}`}>
                                8am - 12pm
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() => handleTimeClick("Afternoon (12pm-4pm)")}
                            className={`w-full p-2 rounded-md border text-xs font-bold uppercase tracking-wider transition-all duration-300 flex flex-col items-center justify-center gap-1 group
                                ${selectedTime === "Afternoon (12pm-4pm)"
                                    ? "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.15)]"
                                    : "bg-transparent border-white/10 text-white hover:border-[#ff3366] hover:text-[#ff3366]"
                                }
                            `}
                        >
                            <span>Afternoon</span>
                            <span className={`text-[8px] ${selectedTime === "Afternoon (12pm-4pm)" ? "text-black/60" : "text-white/40 group-hover:text-[#ff3366]/60"}`}>
                                12pm - 4pm
                            </span>
                        </button>
                    </div>

                    {/* Selected Summary */}
                    <div className="mt-3 text-center">
                        <p className="text-[9px] text-[#666] uppercase tracking-widest mb-0.5">
                            Selected Schedule
                        </p>
                        <p className="text-white text-xs font-medium truncate">
                            {selectedDate ? format(selectedDate, "MMM do") : <span className="text-white/30">Select Date</span>}
                            <span className="mx-1.5 text-[#ff3366]">•</span>
                            {selectedTime ? selectedTime.split(" (")[0] : <span className="text-white/30">Select Time</span>}
                        </p>
                    </div>

                    {/* Footer (Buttons) */}
                    {footer && (
                        <div className="mt-4 pt-4 border-t border-white/10">
                            {footer}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
