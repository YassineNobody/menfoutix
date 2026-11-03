"use client";
import { Modal } from "@/components/Modal/Modal";
import { useModal } from "@/hooks/useModal";
import { Video } from "lucide-react";
interface Props {
    youtubeId: string;
}
export function TrailerModal({ youtubeId }: Props) {
    const modal = useModal();
    return (<Modal isOpen={modal.isOpen} onOpenChange={modal.onOpenChange} title={"Trailer"} size="xl" trigger={<div>
          <button type="button" className="rounded-lg bg-blue-800 hover:bg-blue-900 px-4 py-3 text-white flex flex-row items-center justify-center gap-3 cursor-pointer">
            <Video size={18}/>
            <span>{"Trailer"}</span>
          </button>
        </div>}>
      {modal.isOpen && (<iframe src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(youtubeId)}`} title="Bande-annonce du film" className="aspect-video w-full rounded-lg border-0" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen/>)}
    </Modal>);
}
