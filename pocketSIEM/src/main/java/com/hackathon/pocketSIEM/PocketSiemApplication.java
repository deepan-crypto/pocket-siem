package com.hackathon.pocketSIEM;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class PocketSiemApplication {

	public static void main(String[] args) {
		SpringApplication.run(PocketSiemApplication.class, args);
	}

}
