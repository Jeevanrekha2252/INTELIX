package com.platform.repository;

import com.platform.entity.MeetingActionItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MeetingActionItemRepository extends JpaRepository<MeetingActionItem, String> {
    List<MeetingActionItem> findByMeetingId(String meetingId);
}
