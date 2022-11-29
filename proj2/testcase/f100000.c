#include <stdio.h>
#include <stdlib.h>
#include <time.h>

int main() {
    srand(time(NULL));
    int max = 100000;
    for (int i = 1; i <= max; ++i) {
        printf("f %d\n", rand()%max + 1);
    }
    printf("q\n");
    return 0;
}