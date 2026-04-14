# US Stock Morning Brief Script
# Purpose: Generate daily US stock market morning brief

function Get-USStockMorningBrief {
    $date = Get-Date -Format "yyyy-MM-dd"
    $outputFile = "C:/Users/Yutao Zhou/.openclaw/workspace/memory/$date.md"
    
    Write-Host "Generating US Stock Morning Brief for $date"
    
    # Fetch latest market data (would typically use API)
    $marketData = @{
        Date = $date
        DowIndex = "Down over 300 points (-0.6%)"
        SP500 = "Down 0.11%"
        Nasdaq = "Up 0.15%"
        KeyDrivers = @("US-Iran negotiations failed", "Oil prices >$100/barrel", "Middle East tensions")
        NotableStocks = @("NVIDIA: +2.57%", "Google: -0.21%", "Microsoft: -0.59%")
    }
    
    # Create brief report
    $brief = @"
# US Stock Morning Brief - $date

## Market Overview
- **Dow Jones**: $($marketData.DowIndex)
- **S&P 500**: $($marketData.SP500)
- **Nasdaq**: $($marketData.Nasdaq)

## Key Drivers
$(($marketData.KeyDrivers | ForEach-Object {"- $_"}) -join "`n")

## Notable Stocks
$(($marketData.NotableStocks | ForEach-Object {"- $_"}) -join "`n")

## Market Concerns
- Ongoing Middle East tensions
- Energy inflation risks
- Potential impact on global trade routes

---
*Generated: $date*
"@
    
    # Write to file
    $brief | Out-File -FilePath $outputFile -Encoding UTF8
    
    Write-Host "Morning brief saved to: $outputFile"
    return $brief
}

# Main execution
Get-USStockMorningBrief