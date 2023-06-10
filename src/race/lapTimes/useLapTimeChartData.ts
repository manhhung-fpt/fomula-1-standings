import {useMemo} from 'react';
import {Lap, Timing} from '../../types/ergast';
import {LapByLapProps} from '../lapByLap/LapByLap';
import {getColorWithAlt, getDateFromTimeString, getFastestLapTimeFromLaps} from './helpers';

export type LapChartDatum = {
	x: number,
	y: number,
	timing: Timing
	color: string;
};

export type LapChartSeries = {
	id: string;
	color?: string;
	data: LapChartDatum[]
}

export default function useLapTimeChartData(laps: Lap[], results: LapByLapProps['results']) {
	return useMemo(() => {
		const fastestLap             = results?.find(r => Number(r.FastestLap?.rank) === 1)?.FastestLap;
		const fastestLapTime         = fastestLap ? getDateFromTimeString(results?.find(r => Number(r.FastestLap?.rank) === 1)?.FastestLap?.Time?.time) : getFastestLapTimeFromLaps(laps);
		const data: LapChartSeries[] = [];
		
		if (laps.length) {
			laps.forEach(lap => {
				lap.Timings.forEach(timing => {
					if (!timing.time) {
						return;
					}
					let index = data.findIndex(driver => driver.id === timing.driverId);
					if (index === -1) {
						data.push({
							id: timing.driverId,
							data: []
						});
						index = data.length - 1;
					}
					
					const lapTime      = getDateFromTimeString(timing.time);
					const personalBest = Math.min(...data[index].data.map(l => l.y));
					
					data[index].data.push({x: Number(lap.number), y: lapTime, timing, color: getColorWithAlt(lapTime, personalBest, fastestLapTime).color});
				});
			});
		}
		
		return data;
	}, [laps, results]);
}