package com.stockpulse.unit;

import com.stockpulse.StockPulseApplication;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest(classes = StockPulseApplication.class)
@ActiveProfiles("test")
class StockPulseApplicationTests {

    @Test
    void contextLoads() {
    }

}