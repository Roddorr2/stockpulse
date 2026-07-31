package com.stockpulse.domain.event;

public interface DomainEventPublisher {

    void publish(Object event);

}
