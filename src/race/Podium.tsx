import {Grid} from '@mui/material';
import {Race as RaceT} from '../types/ergast';
import Place from './Place';

export default function Podium({results}: { results: RaceT['Results'] }) {
	if (!results?.length) {
		return null;
	}
	
	const [p1, p2, p3] = results;
	
	return (
		<Grid container spacing={2}>
			{p1.Driver && <Grid item>
				<Place driverId={p1.Driver.driverId} place={1}/>
			</Grid>}
			
			{p2.Driver && <Grid item>
				<Place driverId={p2.Driver.driverId} place={2}/>
			</Grid>}
			
			{p3.Driver && <Grid item>
				<Place driverId={p3.Driver.driverId} place={3}/>
			</Grid>}
		</Grid>
	);
};