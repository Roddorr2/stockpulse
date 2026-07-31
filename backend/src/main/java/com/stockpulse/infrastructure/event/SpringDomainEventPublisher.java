package com.stockpulse.infrastructure.event;

import com.stockpulse.domain.event.DomainEventPublisher;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;

@Component
public class SpringDomainEventPublisher implements DomainEventPublisher {

    private final ApplicationEventPublisher eventPublisher;

    public SpringDomainEventPublisher(ApplicationEventPublisher eventPublisher) {
        this.eventPublisher = eventPublisher;
    }

    @Override
    public void publish(Object event) {
        eventPublisher.publishEvent(event);
    }

}
