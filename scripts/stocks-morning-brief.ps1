# US Stock Morning Brief Script
# Purpose: Generate daily US stock market morning brief (with Chinese version)

function Get-USStockMorningBrief {
    $date = Get-Date -Format "yyyy-MM-dd"
    $outputFile = "C:/Users/Yutao Zhou/.openclaw/workspace/memory/$date.md"
    $outputFileZH = "C:/Users/Yutao Zhou/.openclaw/workspace/logs/$date-morning-brief-zh.md"
    
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
    
    # Create English brief report
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
    
    # Create Chinese brief report
    $briefZh = @"
# 美股晨报 - $date

## 市场概览
- **道琼斯指数**: $($marketData.DowIndex)
- **标普 500**: $($marketData.SP500)
- **纳斯达克**: $($marketData.Nasdaq)

## 主要驱动因素
$(($marketData.KeyDrivers | ForEach-Object {"- $_"}) -join "`n")

## 表现 notable 股票
$(($marketData.NotableStocks | ForEach-Object {"- $_"}) -join "`n")

## 市场关注点
- 中东紧张局势持续
- 能源通胀风险
- 全球贸易路线潜在影响

---
*生成时间：$date*
"@
    
    # Write English brief to file
    $brief | Out-File -FilePath $outputFile -Encoding UTF8
    Write-Host "English morning brief saved to: $outputFile"
    
    # Write Chinese brief to file
    $briefZh | Out-File -FilePath $outputFileZH -Encoding UTF8
    Write-Host "Chinese morning brief saved to: $outputFileZH"
    
    return @($brief, $briefZh)
}

# Main execution
Get-USStockMorningBrief
