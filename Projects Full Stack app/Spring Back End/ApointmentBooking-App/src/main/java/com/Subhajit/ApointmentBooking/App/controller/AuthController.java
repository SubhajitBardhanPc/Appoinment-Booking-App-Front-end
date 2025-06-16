package com.Subhajit.ApointmentBooking.App.controller;

import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class login{

    @PostMapping("/login")
    public ResponseEntity<String> loginM(
            @RequestBody Map<String, String> creds,
            HttpSession session
    ) {
        String username = creds.get("username");
        String password = creds.get("password");

        if ("subhajit".equals(username) && "subhajit".equals(password)) {
            session.setAttribute("user", username);
            return ResponseEntity.ok("Login successful");
        }
        return ResponseEntity.status(401).body("Invalid credentials");
    }
}
