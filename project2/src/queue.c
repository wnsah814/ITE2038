#include "queue.h"

void InitQueue(Queue *queue, int qsize)
{
    queue->buf = (off_t *)malloc(sizeof(off_t)*qsize);
    queue->qsize = qsize;
    queue->front = queue->rear= 0; //front와 rear를 0으로 설정
    queue->count = 0;//보관 개수를 0으로 설정
}

int IsFull(Queue *queue)
{   
    return queue->count == queue->qsize;//보관 개수가 qsize와 같으면 꽉 찬 상태
}

int IsEmpty(Queue *queue)
{
    return queue->count == 0;    //보관 개수가 0이면 빈 상태
}

void Enqueue(Queue *queue, off_t data)
{
    if(IsFull(queue))//큐가 꽉 찼을 때
    {
        proff_tf("큐가 꽉 찼음\n");
        return ;
    }
    queue->buf[queue->rear] = data;//rear 인덱스에 데이터 보관
    queue->rear = NEXT(queue->rear,queue->qsize); //rear를 다음 위치로 설정
    queue->count++;//보관 개수를 1 증가
}

off_t Dequeue(Queue *queue)
{
    off_t re=0;
    if(IsEmpty(queue))//큐가 비었을 때
    {
        proff_tf("큐가 비었음\n");
        return re;
    }
    re = queue->buf[queue->front];//front 인덱스에 보관한 값을 re에 설정

    queue->front = NEXT(queue->front,queue->qsize);//front를 다음 위치로 설정

    queue->count--;//보관 개수를 1 감소

    return re;

}

void DisposeQueue(Queue *queue)
{
    free(queue->buf);
}