from simulations.ma_cross import run_ma_sim
from strategies.range_breakout import run_range_sim
from dateutil import parser
from api.oanda_api import OandaApi
from infrastructure.instrument_collection import instrumentCollection
from infrastructure.collect_data import run_collection


if __name__ == "__main__":
    api = OandaApi()
    dfr = parser.parse("2024-01-01T00:00:00Z")
    dto = parser.parse("2025-10-01T00:00:00Z")

    # Run MA crossover simulation for selected currencies
    # Limit to granularities we have locally (see ./data)
    #run_ma_sim(curr_list=["EUR", "GBP", "USD"], granularity=["H1", "H2"])

#     run_range_sim(
#     curr_list=["EUR", "USD", "GBP"],
#     granularity=["M15"],
#     start_hour=7,
#     end_hour=8,
#     buffer_ticks=20,
#     rr=1.5,
#     filepath="./data"
# )

    instrumentCollection.LoadInstruments("./data")
    run_collection(instrumentCollection, api)

    #run_range_sim()
