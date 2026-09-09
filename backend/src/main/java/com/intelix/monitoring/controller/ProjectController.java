package com.intelix.monitoring.controller;
import java.util.*;import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/projects") public class ProjectController{
@GetMapping public List<Map<String,Object>> projects(){return List.of(Map.of("id",1,"name","Smart Campus 360","health",82,"progress",76,"status","ON_TRACK"),Map.of("id",2,"name","Citizen Service Portal","health",68,"progress",61,"status","AT_RISK"));}
@GetMapping("/{id}/dashboard") public Map<String,Object> dashboard(@PathVariable long id){return Map.of("projectId",id,"health",82,"progress",76,"risks",3,"predictedCompletion","2026-09-21","message","Dashboard intelligence ready");}}
