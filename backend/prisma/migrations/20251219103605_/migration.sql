-- CreateTable
CREATE TABLE `artikel` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `judul` VARCHAR(255) NOT NULL,
    `konten` LONGTEXT NOT NULL,
    `gambarURL` TEXT NULL,
    `kategori` VARCHAR(100) NOT NULL,
    `penulis` VARCHAR(100) NOT NULL,
    `tanggalPublikasi` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `views` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `artikel_kategori_idx`(`kategori`),
    INDEX `artikel_tanggalPublikasi_idx`(`tanggalPublikasi`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
