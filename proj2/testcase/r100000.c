#include <stdio.h>
#include <stdlib.h>
#include <time.h>

int main() {
    srand(time(NULL));
    int max = 100000;

    int choice;
    for (int i = 1; i <= max; ++i) {
        choice = rand() % 5;
        switch (choice) {
            case 0:
            case 1:
            case 2:
                printf("i %d %d\n", rand()%max + 1, (rand()%max + 1)%10);
                break;
            case 3:
                printf("d %d\n", rand()%max + 1);
                break;
            case 4:
                printf("f %d\n", rand()%max + 1);
                break;

        }
    }
    printf("q\n");
    return 0;
}