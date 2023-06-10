import {Box} from '@mui/material';
import {DataGrid, GridColDef} from '@mui/x-data-grid';
import ByLine from '../../drivers/ByLine';
import {LapByLapProps, LapChartSeries} from './LapByLap';
import useLapByLapChartData from './useLapByLapChartData';

type LapByLapTableRow = {
	driverId: LapChartSeries['id'];
	laps: {
		[lap: string]: number | null
	};
}

export default function LapByLapTable({laps, results}: LapByLapProps) {
	const flatData: LapByLapTableRow[] = [];
	const data                         = useLapByLapChartData(laps, results);
	
	data.forEach((serie) => {
		flatData.push({
			driverId: serie.id,
			laps: Object.fromEntries(serie.data.map((d) => (
				[`lap_${d.x}`, d.y]
			)))
		});
	});
	
	const columns: GridColDef<LapByLapTableRow>[] = [
		{
			field: 'driverId',
			headerName: 'Driver',
			flex: 1,
			renderCell: ({value}) => (
				<ByLine id={value} variant="full"/>
			),
			minWidth: 240
		}
	];
	
	for (let i = 1; i <= laps.length; i++) {
		columns.push(
			{
				field: `lap_${i}`,
				headerName: String(i),
				type: 'number',
				align: 'center',
				headerAlign: 'center',
				width: 32,
				valueGetter: ({row, field}) => {
					return row.laps[field];
				}
			}
		);
	}
	
	return (
		<Box height={800}>
			<DataGrid columns={columns} rows={flatData} getRowId={r => r.driverId}/>
		</Box>
	);
}