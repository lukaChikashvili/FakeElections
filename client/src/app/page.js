import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

import { getPartiesWithVotes } from "../../actions/voting";
import PartyChart from '@/components/PartyChart.jsx';


export default async function Home() {
  const parties = await getPartiesWithVotes();

  const chartData = parties.map((party) => ({
    name: party.name,
    percentage: party.votePercentage,
  }));
  return (
   <>
    <section className=' flex items-center justify-center '>
    <PartyChart data={chartData} />
    </section>
   
   </>
  );
}
