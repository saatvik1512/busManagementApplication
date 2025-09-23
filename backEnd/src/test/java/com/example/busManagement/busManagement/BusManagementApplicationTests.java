package com.example.busManagement.busManagement;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = {
    "jwt.secret=testsecret123",
    "jwt.expiration=86400"
})
class BusManagementApplicationTests {

	@Test
	void contextLoads() {
	}

}
