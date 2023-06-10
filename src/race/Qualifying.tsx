import {Alert, Skeleton} from '@mui/material';
import {DataGrid} from '@mui/x-data-grid';
import {useEffect, useState} from 'react';
import Caxios from '../api/Caxios';
import {getAPIUrl, mapQualifying} from '../api/Ergast';
import ConstructorByLine from '../constructors/ByLine';
import ByLine from '../drivers/ByLine';
import {QualifyingResult} from '../types/ergast';

const sx = {
	border: 0,
	'& > div > .MuiDataGrid-footerContainer': {
		display: 'none'
	}
};

type QualifyingProps = {
	season: string;
	round: string;
}

export default function Qualifying({season, round}: QualifyingProps) {
	const [data, setData] = useState<QualifyingResult[] | undefined>();
	
	useEffect(() => {
		const dataUrl = getAPIUrl(`/${season}/${round}/qualifying.json`);
		Caxios.get(dataUrl)
		      .then(mapQualifying)
		      .then(d => setData(d))
		      .catch(() => setData([]));
	}, [season, round]);
	
	if (!data) {
		return <Skeleton variant="rectangular" height={400}/>;
	}
	
	if (!data.length) {
		return <Alert variant="outlined" severity="info">Qualifying Data Not Available</Alert>;
	}
	
	return (
		<DataGrid
			sx={sx}
			rows={data}
			autoHeight
			density="compact"
			columns={
				[
					{
						field: 'position',
						headerName: 'P',
						width: 60,
						headerAlign: 'center',
						align: 'center',
						type: 'number'
					},
					{
						field: 'Driver',
						headerName: 'Driver',
						flex: 1,
						renderCell: ({row}) => row.Driver ? <ByLine id={row.Driver.driverId}/> : '',
						minWidth: 200
					},
					{
						field: 'Constructor',
						headerName: 'Constructor',
						flex: 1,
						renderCell: ({row}) => row.Constructor ? <ConstructorByLine id={row.Constructor.constructorId}/> : '',
						minWidth: 150
					},
					{
						field: 'Q1',
						headerName: 'Q1',
						headerAlign: 'center',
						align: 'center',
						type: 'string'
					},
					{
						field: 'Q2',
						headerName: 'Q2',
						headerAlign: 'center',
						align: 'center',
						type: 'string'
					},
					{
						field: 'Q3',
						headerName: 'Q3',
						headerAlign: 'center',
						align: 'center',
						type: 'string'
					}
				]
			}
		/>
	);
}