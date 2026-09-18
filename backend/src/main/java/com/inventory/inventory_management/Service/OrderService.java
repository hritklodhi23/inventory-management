package com.inventory.inventory_management.Service;

import com.inventory.inventory_management.model.Order;
import com.inventory.inventory_management.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    public Order createOrder(Order order) {
        if (order.getStatus() == null || order.getStatus().isBlank()) {
            order.setStatus("PENDING");
        }

        if (order.getOrderDate() == null) {
            order.setOrderDate(java.time.LocalDateTime.now());
        }

        return orderRepository.save(order);
    }

    public Order updateStatus(Long id, String status) {
        Order order = getOrderById(id);
        order.setStatus(status);
        return orderRepository.save(order);
    }

    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }
}