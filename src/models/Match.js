class Match {
    static match(data) {
        return {
            id: data.id || '',
            awayTeamCode: data.awayTeamCode || '',
            awayTeamFlag: data.awayTeamFlag || '',
            awayTeamName: data.awayTeamName || '',
            date: data.date || '',
            homeTeamCode: data.homeTeamCode || '',
            homeTeamFlag: data.homeTeamFlag || '',
            homeTeamName: data.homeTeamName || '',
        };
    }
}
export default Match;
