import React, { useState } from 'react';
import Chart from "react-google-charts";
import useAxios from 'axios-hooks'


const baseUrl = process.env.REACT_APP_MONEYWISE_BASE_URL;

interface IDayByDayApi {
    daybydays: {
        date: string;
        balance: {
            open: number;
            low: number;
            high: number;
            close: number;
        };
        working_capital: {
            open: number;
            low: number;
            high: number;
            close: number;
        };
    }[]
}

const options = {
    title: "",
    curveType: "none",
    legend: { position: "top" },
    tooltip: {},
    hAxis: {
        title: "Time",
        minTextSpacing: 10,
        format: "short"
    },
    vAxis: {
        title: "Funds"
    }

};

const DayByDayChart = ({ daybyday, chartType }: { daybyday: IDayByDayApi, chartType: 'SteppedAreaChart' | 'CandlestickChart' }) => {
    if (!daybyday.daybydays.length) {
        return <>
            <p data-testid="daybyday-empty">Looks like there are no transactions in the time frame selected...</p>
        </>
    }

    if (chartType === 'SteppedAreaChart') {
        const data = [
            ['Day', 'Balance', 'Working Capital'],
            ...daybyday.daybydays.map(candle => [
                candle.date,
                Number(candle.balance.low),
                Number(candle.working_capital.low),
            ])
        ]
        return <Chart
          chartType="SteppedAreaChart"
          width="100%"
          height="400px"
          data={data}
          options={options}
        />
    }

    if (chartType === 'CandlestickChart') {
        const data = [
            ['Day', 'Balance', 'Balance base bottom', 'Balance base top', 'Balance high', 'Working Capital', 'Working Capital base bottom', 'Working Capital base top', 'Working Capital high'],
            ...daybyday.daybydays.map(candle => {
                return [
                    candle.date,
                    candle.balance.low,
                    candle.balance.open,
                    candle.balance.close,
                    candle.balance.high,
                    candle.working_capital.low,
                    candle.working_capital.open,
                    candle.working_capital.close,
                    candle.working_capital.high,
                ]
            })
        ]
        return <Chart
            chartType="CandlestickChart"
            width="100%"
            height="400px"
            data={data}
            options={{
                bar: { groupWidth: '100%' }, // Remove space between bars.
                candlestick: {
                    risingColor: {
                        fill: '#FFFFFF'
                    },
                    fallingColor: {
                        fill: '#FFFFFF'
                    },
                }
            }}
        />
    }

    return null
}

export const DayByDayContainer = ({ userid, currentTime }: { userid: string, currentTime: number }) => {
    
    const [chartType, setChartType] = useState<'SteppedAreaChart' | 'CandlestickChart'>('SteppedAreaChart');

    const [queryRangeDays, setQueryRangeDays] = useState(90);

    const start = new Date(currentTime);
    const end = new Date(currentTime + (queryRangeDays * 24 * 60 * 60 * 1000))
    
    const [{ data, loading, error }] = useAxios(
        `${baseUrl}/api/daybydays?userid=${userid}&startDate=${start.toISOString()}&endDate=${end.toISOString()}`
    )

    if (loading) {
        return <p data-testid="daybyday-loading">Loading...</p>
    }

    if (error) {
        return <p data-testid="daybyday-error">Error occurred while fetching daybydays! Try refreshing the page.</p>
    }

    const daybyday = data

    return <>
        <button className="btn btn-outline-primary btn-sm" onClick={() => setChartType(t => t === 'SteppedAreaChart' ? 'CandlestickChart' : 'SteppedAreaChart')}>Toggle Candlesticks</button>
        <DayByDayChart chartType={chartType} daybyday={daybyday} />
        <button className="btn btn-outline-primary btn-sm" onClick={() => {setQueryRangeDays(30)}}>1 Month</button>&nbsp;
        <button className="btn btn-outline-primary btn-sm" onClick={() => {setQueryRangeDays(90)}}>3 Months</button>&nbsp;
        <button className="btn btn-outline-primary btn-sm" onClick={() => {setQueryRangeDays(365)}}>1 Year</button>&nbsp;
        <button className="btn btn-outline-primary btn-sm" onClick={() => {setQueryRangeDays(730)}}>2 Years</button>&nbsp;
        <br />
    </>
}