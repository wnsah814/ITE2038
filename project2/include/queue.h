#define NEXT(index,QSIZE)   ((index+1)%QSIZE)  //원형 큐에서 인덱스를 변경하는 매크로 함수
#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
typedef long off_t;

typedef struct Queue //Queue 구조체 정의
{
    int *buf;//저장소
    int qsize;
    int front; //꺼낼 인덱스(가장 오래전에 보관한 데이터가 있는 인덱스)
    int rear;//보관할 인덱스
    int count;//보관 개수
} Queue;

void InitQueue(Queue *queue,int qsize);//큐 초기화

int IsFull(Queue *queue); //큐가 꽉 찼는지 확인

int IsEmpty(Queue *queue); //큐가 비었는지 확인

void Enqueue(Queue *queue,off_t data); //큐에 보관

off_t Dequeue(Queue *queue); //큐에서 꺼냄

void DisposeQueue(Queue *queue);//큐 해제화