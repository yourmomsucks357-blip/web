# Vehicle Evaluator

This module provides a practical evaluator algorithm for offer recommendation.

## Files

1. vehicleEvaluator.ts: core scoring and recommendation logic.
2. vehicleEvaluator.examples.ts: sample inputs and outputs.
3. index.ts: module export surface.

## Input Highlights

1. baseMarketValue, year, mileage
2. conditionScore (1-10)
3. accidentCount
4. serviceHistoryRatio (0-1)
5. titleStatus (clean, rebuilt, salvage, lemon)
6. demandIndex (0-1)

## Output

1. score (0-100)
2. adjustedValue
3. offerBand (low/target/high)
4. recommendation (buy, negotiate, pass)
5. confidence (0-1)
6. top reasons
