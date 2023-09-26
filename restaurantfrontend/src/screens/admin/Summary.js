import Chart from "../../components/DashboardComponent/Chart"
import { Grid,Paper } from "@mui/material"
export default function Summary(props)
{
  return(<div>
    {/* Chart */}
    <Grid container spacing={3}>
    <Grid item xs={12} md={8} lg={9}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 240,
                  }}
                >
                  <Chart />
                </Paper>
              </Grid>
          </Grid>    

  </div>)

}